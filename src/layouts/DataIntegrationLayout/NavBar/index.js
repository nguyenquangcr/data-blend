import React, { useEffect } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import NavItem from './NavItem';
import MenuLists from './config';
import PropTypes from 'prop-types';
import Logo from '~/components/Logo';
import Scrollbars from '~/components/Scrollbars';
import { makeStyles } from '@mui/styles';
import { List, Box, Drawer, Hidden, ListSubheader } from '@mui/material';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 260;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('lg')]: {
      flexShrink: 0,
      width: DRAWER_WIDTH
    }
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
    background: theme.palette.background.default
  },
  list: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(5)
    }
  },
  subHeader: {
    ...theme.typography.overline,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    color: theme.palette.text.primary
  }
}));

// ----------------------------------------------------------------------

NavBar.propTypes = {
  isOpenNav: PropTypes.bool,
  onCloseNav: PropTypes.func
};

function NavBar({ isOpenNav, onCloseNav }) {
  const classes = useStyles();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenNav && onCloseNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbars>
      <Box sx={{ p: 1, pb: 5 }}>
        <Hidden mdUp>
          <Box sx={{ px: 2, py: 3 }}>
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        {MenuLists.map(list => (
          <List
            disablePadding
            key={list.subheader}
            className={classes.list}
            subheader={
              <ListSubheader
                // disableSticky
                // disableGutters
                className={classes.subHeader}
              >
                {list.subheader}
              </ListSubheader>
            }
          >
            {list.items.map(item => (
              <NavItem key={item.title} link={item} />
            ))}
          </List>
        ))}
      </Box>
    </Scrollbars>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          open={isOpenNav}
          variant="temporary"
          onClose={onCloseNav}
          classes={{ paper: classes.drawerPaper }}
        >
          {renderContent}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          open
          anchor="left"
          variant="persistent"
          classes={{ paper: classes.drawerPaper }}
        >
          <Box sx={{ pt: 10, height: '100%' }}>{renderContent}</Box>
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default NavBar;
