import User from '../models/User.js';
import { sendInvitationEmail } from '../utils/emailService.js';
import crypto from 'crypto';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    console.log(`[UserController] Fetching all users...`);
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(`[UserController] getUsers Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    console.log(`[UserController] User deleted: ${user.email}`);
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(`[UserController] deleteUser Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// @desc    Invite new admin
// @route   POST /api/users/invite
// @access  Private/Admin
export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log(`[UserController] Inviting user: ${email} with role ${role}`);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Generate unique invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(inviteToken).digest('hex');

    // Create user with placeholder password (will be changed during setup)
    const newUser = new User({
      email,
      role: role || 'Editor',
      password: crypto.randomBytes(8).toString('hex'), 
      invitationToken: hashedToken,
      invitationExpire: Date.now() + 48 * 60 * 60 * 1000 // 48 hours
    });

    await newUser.save();
    
    // Construct the invitation URL
    const setupLink = `${process.env.FRONTEND_URL || 'https://www.nanoworldschool.co.in'}/accept-invitation?token=${inviteToken}`;
    
    try {
      // Use the email service helper (we'll update it to handle name/password setup context)
      await sendInvitationEmail(email, "Click the link below to set up your account", setupLink);
    } catch (mailError) {
      console.error(`[UserController] Mail sending failed for invitation: ${mailError.message}`);
      return res.status(201).json({ 
        success: true, 
        message: `User record created, but invitation email failed to send. Link: ${setupLink}` 
      });
    }

    res.status(201).json({ 
      success: true, 
      message: `Invitation link sent successfully to ${email}.` 
    });
  } catch (error) {
    console.error(`[UserController] inviteUser Error: ${error.message}`);
    res.status(500).json({ error: error.message || 'Failed to process invitation' });
  }
};

// @desc    Accept invitation & set name/password
// @route   POST /api/users/accept-invitation
// @access  Public
export const acceptInvitation = async (req, res) => {
  try {
    const { token, fullName, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      invitationToken: hashedToken,
      invitationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired invitation link' });
    }

    user.fullName = fullName;
    user.password = password;
    user.invitationToken = undefined;
    user.invitationExpire = undefined;

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Account setup complete! You can now log in.' 
    });
  } catch (error) {
    console.error(`[UserController] acceptInvitation Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to complete account setup' });
  }
};
