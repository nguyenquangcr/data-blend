import React from 'react';
import Page from '~/components/Page';
import ReadMdFile from '~/components/ReadMdFile';
import content from './content.md';

// ----------------------------------------------------------------------

export default function ColorView() {
  return (
    <Page title="Color">
      <ReadMdFile content={content} />
    </Page>
  );
}
