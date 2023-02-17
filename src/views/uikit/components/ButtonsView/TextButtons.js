import React from 'react';
import Block from '~/components/Block';
import AlarmIcon from '@mui/icons-material/Alarm';
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MButton } from '~/@material-extend';

// ----------------------------------------------------------------------

function TextButtons() {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={6}>
        <Block title="Base">
          <Button color="inherit">Default</Button>
          <Button>Primary</Button>
          <Button disabled>Disabled</Button>
          <Button>Link</Button>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Adding Colors">
          <MButton color="inherit">Default</MButton>
          <MButton>Primary</MButton>
          <MButton color="info">Info</MButton>
          <MButton color="success">Success</MButton>
          <MButton color="warning">Warning</MButton>
          <MButton color="error">Error</MButton>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="With Icon & Loading">
          <MButton color="error" startIcon={<AlarmIcon />}>
            Icon Left
          </MButton>
          <MButton color="error" endIcon={<AlarmIcon />}>
            Icon Right
          </MButton>
          <LoadingButton
            pending
            pendingPosition="start"
            startIcon={<AlarmIcon />}
          >
            Save
          </LoadingButton>
        </Block>
      </Grid>

      <Grid item xs={12} md={6}>
        <Block title="Size">
          <MButton color="info" size="small">
            Small
          </MButton>
          <MButton color="info">Medium</MButton>
          <MButton color="info" size="large">
            Large
          </MButton>
        </Block>
      </Grid>
    </Grid>
  );
}

export default TextButtons;
