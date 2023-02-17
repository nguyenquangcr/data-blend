import React from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardHeader,
  Typography
} from '@mui/material';
import { MIcon } from '~/@material-extend';
import { Icon } from '@iconify/react';
import apartmentOutlined from '@iconify-icons/ant-design/apartment-outlined';
import barChartOutlined from '@iconify-icons/ant-design/bar-chart-outlined';
import userOutlined from '@iconify-icons/ant-design/user-outlined';
import linkOutlined from '@iconify-icons/ant-design/link-outlined';
import folderOpenOutlined from '@iconify-icons/ant-design/folder-open-outlined';
import fileSearchOutlined from '@iconify-icons/ant-design/file-search-outlined';
import clusterOutlined from '@iconify-icons/ant-design/cluster-outlined';
import databaseOutlined from '@iconify-icons/ant-design/database-outlined';
import desktopOutlined from '@iconify-icons/ant-design/desktop-outlined';
import shareAltOutlined from '@iconify-icons/ant-design/share-alt-outlined';
import Page from '~/components/Page';

const path = name => `/static/icons/${name}.svg`;

const PAGES = [
  { text: 'Dashboard', icon: barChartOutlined },
  { text: 'Insight', icon: userOutlined },
  { text: 'Infra', icon: apartmentOutlined },
  { text: 'CDP', icon: apartmentOutlined }
];

const ADMIN_PAGES = [
  { text: 'Power BI', icon: 'powerBI-logo' },
  { text: 'Air Flow', icon: 'airflow-logo' },
  { text: 'Machine Learning', icon: shareAltOutlined, color: 'info' },
  { text: 'Data Catalog', icon: folderOpenOutlined, color: 'primary' },
  { text: 'Data Studio', icon: desktopOutlined, color: 'info' },
  { text: 'Data Quality', icon: fileSearchOutlined, color: 'success' },
  { text: 'Data Warehouse', icon: clusterOutlined, color: 'info' },
  { text: 'Data Storage', icon: databaseOutlined, color: 'info' }
];

const DOC_LINKS = [
  { text: 'Technical Document', icon: linkOutlined },
  { text: 'Task management', icon: linkOutlined },
  { text: 'Engineer wiki', icon: linkOutlined },
  { text: 'Quick access', icon: linkOutlined }
];

// ----------------------------------------------------------------------

const useStyles = makeStyles(theme => ({
  root: {}
}));

// ----------------------------------------------------------------------

function DashboardOverview() {
  const classes = useStyles();
  const theme = useTheme();
  const { roles, groups } = useSelector(state => state.auth);

  return (
    <Page title="Overview" className={classes.root}>
      <Container maxWidth="lg">
        <Card>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <CardHeader sx={{ p: 0, mb: 2 }} title="Navigate" />
              <Box sx={{ display: 'flex' }}>
                {PAGES.map(item => (
                  <ListItem key={item.text}>
                    <ListItemIcon>
                      <Icon
                        icon={item.icon}
                        width={36}
                        height={36}
                        color={theme.palette.primary.main}
                      />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <CardHeader sx={{ p: 0, mb: 2 }} title="Admin Space" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {ADMIN_PAGES.map(item => (
                  <Box
                    key={item.text}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {typeof item.icon === 'string' ? (
                      <MIcon src={path(item.icon)} size={36} />
                    ) : (
                      <Icon
                        icon={item.icon}
                        width={36}
                        height={36}
                        color={theme.palette[item.color].main}
                      />
                    )}
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <CardHeader sx={{ p: 0, mb: 2 }} title="Useful Links" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {DOC_LINKS.map(item => (
                  <Box
                    key={item.text}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      color: `info.main`
                    }}
                  >
                    <Typography sx={{ mr: 1 }}>{item.text}</Typography>
                    <Icon icon={item.icon} width={24} height={24} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default DashboardOverview;
