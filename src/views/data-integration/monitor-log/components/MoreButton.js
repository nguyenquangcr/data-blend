import { Icon } from '@iconify/react';
import React, { useRef, useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import moreVerticalFill from '@iconify-icons/eva/more-vertical-fill';
import trash2Fill from '@iconify-icons/eva/trash-2-fill';
import { makeStyles } from '@mui/styles';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { deleteProject } from '~/redux/slices/project';
import { ToastContainer } from 'react-toastify';

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  menu: {
    width: 220,
    maxWidth: '100%'
  },
  menuItem: { color: theme.palette.text.secondary }
}));

// ----------------------------------------------------------------------

function MoreButton({ className, id, ...other }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClickDelete = () => {
    dispatch(deleteProject(id));
    setIsOpen(false);
  };

  const OPTIONS = [
    { text: 'Delete', icon: trash2Fill, action: handleClickDelete }
  ];

  return (
    <>
      <IconButton
        ref={ref}
        className={className}
        onClick={() => setIsOpen(true)}
        {...other}
      >
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{ className: classes.menu }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {OPTIONS.map(item => (
          <MenuItem
            key={item.text}
            onClick={item.action}
            className={classes.menuItem}
          >
            <ListItemIcon>
              <Icon icon={item.icon} width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ variant: 'body2' }}
            />
          </MenuItem>
        ))}
      </Menu>
      {/* <ToastContainer /> */}
    </>
  );
}

export default memo(MoreButton);
