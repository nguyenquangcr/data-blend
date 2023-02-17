import NavBar from './NavBar';
import TopBar from './TopBar';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar, useOnClickOutside } from '@cads-ui/core';
import { changeIsOpenLeftMenuHeader } from '~/redux/slices/project';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';

import { AccountTree } from '@mui/icons-material';

import FolderZipIcon from '@mui/icons-material/FolderZip';

// ----------------------------------------------------------------------

const APP_BAR_DESKTOP = 92;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
    background: 'rgb(248, 249, 250)'
  },
  main: {
    paddingTop: '0px !important',
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    position: 'relative',
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    [theme.breakpoints.up('lg')]: {
      paddingTop: APP_BAR_DESKTOP
    }
  },
  wrapper: {
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    position: 'relative',
    paddingBottom: 24,
    transition: '.7s'
  },
  wrapperAfterCollapsed: {
    transition: '.7s'
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    minHeight: '100%'
  },
  sidebar: {
    '& .sidebar-home__icon': {
      height: '30px !important'
    }
  },
  labelbodyClose: {
    marginLeft: '90px'
  },
  labelbodyOpen: {
    marginLeft: '325px'
  }
}));

export const SIDEBAR_WIDTH = 310;

// ----------------------------------------------------------------------

DocsLayout.propTypes = {
  children: PropTypes.node
};

function DocsLayout({ children }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const sidebarRef = useRef(null);
  const {
    isOpenLeftMenuHeader,
    projects,
    checkIdProjectPageDetail
  } = useSelector(state => state.project);
  const tablet = useMediaQuery('(max-width:1500px)');
  const [openNav, setOpenNav] = useState(false);
  const [itemNavbar, setItemNavbar] = useState([{ group: 'GENERAL' }]);

  useOnClickOutside(sidebarRef, () => {
    if (window.innerWidth < 1500) {
      dispatch(changeIsOpenLeftMenuHeader({ value: true }));
    }
  });

  React.useEffect(() => {
    let arrSubMenu = [];
    projects &&
      projects?.map(({ name, id }) => {
        arrSubMenu?.push({
          label: name,
          icon: <FolderZipIcon />,
          link: `/di/${id}`
        });
      });
    setItemNavbar([
      {
        group: 'GENERAL',
        menu: [
          {
            icon: <AccountTree />,
            label: 'Project',
            subMenu: arrSubMenu
          }
        ]
      }
    ]);
  }, [projects]);

  function handleToggleNavbar() {
    dispatch(changeIsOpenLeftMenuHeader({ value: !isOpenLeftMenuHeader }));
  }

  return (
    <div className={classes.root}>
      {/* {checkIdProjectPageDetail == null && ( */}
      <Sidebar
        ref={sidebarRef}
        className={classes.sidebar}
        items={itemNavbar}
        homeTitle="cIntegration"
        homeLogo={
          <img
            src={`${process.env.REACT_APP_URL}/img/dmc/apps/datablend.png`}
          />
        }
        showToggleIcon
        hoverToggle={false}
        homeLink={'/'}
        width={SIDEBAR_WIDTH}
        isSmall={isOpenLeftMenuHeader}
        hide={tablet && isOpenLeftMenuHeader}
        onNavigate={link => {
          window.location = link;
        }}
        onToggleIconClick={handleToggleNavbar}
      />

      <TopBar onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          mt: 13,
          mb: 1,
          flexGrow: 1,
          transition:
            'margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, margin-right 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }}
        className={clsx(
          isOpenLeftMenuHeader == false
            ? classes.labelbodyOpen
            : classes.labelbodyClose
        )}
      >
        {children}
      </Box>
    </div>
  );
}

export default DocsLayout;
