import React, { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Logo from '~/components/Logo';
import { Icon } from '@iconify/react';
import { PATH_APP, PATH_DATA_INTEGRATION } from '~/routes/paths';
import sunFill from '@iconify-icons/eva/sun-fill';
import moonFill from '@iconify-icons/eva/moon-fill';
import { toggleTheme } from '~/redux/slices/dark-mode';
import { useDispatch, useSelector } from 'react-redux';
import menu2Fill from '@iconify-icons/eva/menu-2-fill';
import arrowIosForwardFill from '@iconify-icons/eva/arrow-ios-forward-fill';
import monitorOutline from '@iconify-icons/eva/monitor-outline';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  AppBar,
  Hidden,
  Toolbar,
  IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Account from './Account';
import { changeIsOpenLeftMenuHeader } from '~/redux/slices/project';

// ----------------------------------------------------------------------

const APPBAR_HEIGHT = 64;

const useStyles = makeStyles(theme => ({
  customHeaderWhenHasNav: {
    width: '95%',
    transition:
      'width 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
  },
  customHeaderWhenNotHasNav: {
    width: '99%',
    transition:
      'width 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
  },
  root: {
    zIndex: '999',
    backdropFilter: 'blur(8px)',
    color: theme.palette.text.primary,
    margin: '.5% 1%',
    boxShadow: 'none',
    borderRadius: '1rem',
    backdropFilter: 'saturate(200%) blur(1.875rem)',
    backgroundColor: 'transparent',
    [theme.breakpoints.up('md')]: {},
    transition:
      'width 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
  },
  toolbar: {
    minHeight: APPBAR_HEIGHT
  },
  customLeftHeader: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    '& span': {
      fontSize: ' 25px',
      margin: ' 6px 0px 0px 12px',
      fontWeight: ' 400',
      color: ' rgb(52, 71, 103)'
    }
  },
  labelHeaderClose: {
    width: '81%',
    transition:
      'width 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, margin 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
  }
}));

// ----------------------------------------------------------------------

TopBar.propTypes = {
  onOpenNav: PropTypes.func
};

function TopBar({ onOpenNav, className }) {
  const { isOpenLeftMenuHeader, checkIdProjectPageDetail } = useSelector(
    state => state.project
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.theme);
  const onToggleTheme = useCallback(() => dispatch(toggleTheme()), [dispatch]);

  return (
    <AppBar
      className={clsx(
        classes.customHeaderWhenHasNav,
        classes.root,
        isOpenLeftMenuHeader == false ? classes.labelHeaderClose : ''
      )}
    >
      <Toolbar className={classes.toolbar}>
        {/* {checkIdProjectPageDetail == null ? (
          <Box>
            {isOpenLeftMenuHeader == false ? (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => {
                  dispatch(
                    changeIsOpenLeftMenuHeader({ value: !isOpenLeftMenuHeader })
                  );
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 3 }}
                onClick={() => {
                  dispatch(
                    changeIsOpenLeftMenuHeader({ value: !isOpenLeftMenuHeader })
                  );
                }}
              >
                <MenuOpenIcon />
              </IconButton>
            )}
          </Box>
        ) : (
          <RouterLink className={classes.customLeftHeader} to="/">
            <Logo /> <span>cIntegration</span>
          </RouterLink>
        )} */}

        <Box sx={{ flexGrow: 1 }} />
        <Account />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
