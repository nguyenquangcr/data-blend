import React from 'react';
import Page from '~/components/Page';
import ReadMdFile from '~/components/ReadMdFile';
import content from './content.md';

// ----------------------------------------------------------------------

export default function WebpackMigration() {
  return (
    <Page title="Webpack Migration">
      <ReadMdFile content={content} />
    </Page>
  );
}
