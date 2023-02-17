import clsx from 'clsx';
import React from 'react';
import PostItem from './PostItem';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  root: {}
}));

// ----------------------------------------------------------------------

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  className: PropTypes.string
};

function PostList({ posts, className }) {
  const classes = useStyles();

  return (
    <Grid container spacing={3} className={clsx(classes.root, className)}>
      {posts.map((post, index) => (
        <PostItem key={post.id} post={post} index={index} />
      ))}
    </Grid>
  );
}

export default PostList;
