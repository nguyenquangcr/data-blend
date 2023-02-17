import React, { useRef, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import MyAvatar from '~/components/MyAvatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { useSnackbar } from 'notistack';
// import { PATH_APP } from '~/routes/paths';
// import { useFirebase } from 'react-redux-firebase';
// import personFill from '@iconify-icons/eva/person-fill';
// import settingsFill from '@iconify-icons/eva/settings-fill';
import { CENTRAL_LOGOUT_ENDPOINT } from '~/api/endpoint';
import PopoverMenu from '~/components/PopoverMenu';
import useIsMountedRef from '~/hooks/useIsMountedRef';
import homeFill from '@iconify-icons/eva/home-fill';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Button, Box, Divider, MenuItem, Typography } from '@mui/material';
import { MIconButton } from '~/@material-extend';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/'
  }
];

const useStyles = makeStyles(theme => ({
  labelBoxInfo: {
    marginLeft: '1rem',
    cursor: 'pointer'
  },
  labelName: {
    color: ' rgba(0, 0, 0, 0.87)',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '18px',
    height: '25px'
  },
  labelRole: {
    color: 'rgba(0, 0, 0, 0.38)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '12px'
  },
  menuItem: {
    ...theme.typography.body2,
    padding: theme.spacing(1, 2.5)
  },
  btnAvatar: {
    color: '#ffff',
    padding: 0,
    width: 44,
    height: 44
  },
  isSelected: {
    '&:before': {
      zIndex: 1,
      content: "''",
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      position: 'absolute',
      background: alpha(theme.palette.grey[900], 0.8)
    }
  },
  divider: {
    margin: theme.spacing(1, 0)
  }
}));

// ----------------------------------------------------------------------

function Account() {
  const { userScope } = useSelector(state => state.project);
  const classes = useStyles();
  const anchorRef = useRef(null);
  const isMountedRef = useIsMountedRef();
  const [isOpen, setOpen] = useState(false);
  const displayName = userScope?.name || 'Administrator';

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('userScope');
      localStorage.removeItem('accessToken');
      window.location = CENTRAL_LOGOUT_ENDPOINT;
      if (isMountedRef.current) {
        handleClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        className={clsx(classes.btnAvatar, { [classes.isSelected]: isOpen })}
      >
        <MyAvatar />
      </MIconButton>
      <Box onClick={handleOpen} className={classes.labelBoxInfo}>
        <Typography
          className={classes.labelName}
          variant="subtitle1"
          color="textPrimary"
          noWrap
        >
          {userScope?.name}
        </Typography>
        <Typography
          className={classes.labelRole}
          variant="subtitle1"
          color="textPrimary"
          noWrap
        >
          {userScope?.role}
        </Typography>
      </Box>

      <PopoverMenu
        width={220}
        open={isOpen}
        onClose={handleClose}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ my: 2, px: 2.5 }}>
          <Typography variant="subtitle1" color="textPrimary" noWrap>
            {displayName}
          </Typography>
          {/* <Typography variant="body2" color="textSecondary" noWrap>
            {'demo@fpt.com.vn'}
          </Typography> */}
        </Box>

        <Divider className={classes.divider} />

        {MENU_OPTIONS.map(option => (
          <MenuItem
            key={option.label}
            to={option.linkTo}
            component={RouterLink}
            onClick={handleClose}
            className={classes.menuItem}
          >
            <Box
              component={Icon}
              icon={option.icon}
              sx={{
                mr: 2,
                width: 24,
                height: 24
              }}
            />

            {option.label}
          </MenuItem>
        ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </PopoverMenu>
    </>
  );
}

export default Account;
