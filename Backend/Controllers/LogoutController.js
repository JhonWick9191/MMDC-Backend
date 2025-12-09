// Controllers/LogoutController.js
const logoutUser = async (req, res) => {
  try {
    // Production vs development cookie settings
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Clear the token cookie with exact same options as set during login
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,           // localhost: false, production: true
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',                      // Important: must match login cookie path
      maxAge: 0                       // Immediately expire
    });

    // Optional: Log the logout for debugging
    console.log(`User logged out successfully at ${new Date().toISOString()}`);

    return res.status(200).json({
      success: true,
      message: 'Logout successful!',
      data: {
        user: null,
        token: null
      }
    });

  } catch (error) {
    console.error('Logout error:', error.message);
    
    return res.status(500).json({
      success: false,
      message: 'Logout failed! Please try again.',
      error: error.message
    });
  }
};

module.exports = { logoutUser };
