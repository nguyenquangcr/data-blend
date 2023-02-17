import {
  TextField,
  Box,
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import { Icon } from '@iconify/react';
import React from 'react';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from 'react-redux';
import { createConnection } from '~/redux/slices/project';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
import EyeOff from '@iconify-icons/eva/eye-off-outline';
import EyeOn from '@iconify-icons/eva/eye-outline';
import PlustCircle from '@iconify-icons/eva/plus-circle-outline';
import MinusIcon from '@iconify-icons/eva/minus-circle-outline';

const useStyles = makeStyles(theme => ({
  cardStyle: {
    position: 'fixed',
    zIndex: 1,
    right: '-100%',
    top: '12%',
    borderRadius: '8px 0px 0px 8px',
    transition: '0.5s',
    backgroundColor: theme.palette.background.default,
    transition: 'all .7s'
  },
  openCardRight: {
    right: '0'
  },
  boxCustomForm: {
    height: '75vh',
    overflowY: 'auto',
    marginBottom: '20px',
    paddingRight: '10px',
    paddingTop: '10px',
    scrollBehavior: 'smooth'
  },
  cssLabel: {
    color: '#3853c8'
  },
  customBoxNotification: {
    border: 'solid 1px #cbcbcb',
    borderRadius: '10px',
    padding: '5px 10px',
    margin: '20px 5px',
    position: 'relative'
  },
  BoxCustomButton: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& .btn-cancel': {
      backgroundColor: '#ffff',
      color: '#3853c8',
      border: 'solid 1px #3853c8',
      marginRight: '10px'
    }
  }
}));

const FormAddConnection = ({ setIsOpen, idProject }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { isLoading } = useSelector(state => state.project);
  //state
  const [valueType, setValueType] = React.useState('');
  const [isOpen, setIsOpenSchedule] = React.useState(false);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    type: yup.string('Enter your type').required('Type is required'),
    host:
      valueType == 'PostgreSqlConnection'
        ? yup.string('Enter your host').required('Host is required')
        : valueType == 'GitLabConnection'
        ? yup.string('Enter your host').required('Host is required')
        : '',
    port:
      valueType == 'PostgreSqlConnection' &&
      yup
        .number()
        .max(9000, 'Limit number port max 9000')
        .required('This field is requried'),
    database:
      valueType == 'PostgreSqlConnection' &&
      yup.string('Enter your database').required('Database is required'),
    username:
      valueType == 'PostgreSqlConnection' &&
      yup.string('Enter your username').required('Username is required'),
    password:
      valueType == 'PostgreSqlConnection' &&
      yup.string('Enter your password').required('Password is required'),
    reposistory:
      valueType == 'GitLabConnection' &&
      yup.string('Enter your reposistory').required('Reposistory is required'),
    apiKey:
      valueType == 'GitLabConnection' &&
      yup.string('Enter your apiKey').required('ApiKey is required'),
    locationFtel:
      valueType == 'FtelLakeHouseConnection'
        ? isOpen == true
          ? yup.string('Enter your location').required('Location is required')
          : ''
        : '',
    notificationChannels: yup.array().of(
      yup.object({
        type: yup.string().required('Required'),
        message: yup.string().required('Required'),
        botToken: yup.string().when('type', {
          is: 'Telegram',
          then: yup.string().required('Required'),
          otherwise: yup.string()
        }),
        chatId: yup.string().when('type', {
          is: 'Telegram',
          then: yup.string().required('Required'),
          otherwise: yup.string()
        }),
        to: yup.array()
      })
    ),
    usernameFtel:
      valueType == 'FtelLakeHouseConnection' &&
      yup.string('Enter your username').required('Username is required'),
    passwordFtel:
      valueType == 'FtelLakeHouseConnection' &&
      yup.string('Enter your password').required('Password is required'),
    usernameFtelSharedStorage:
      valueType == 'FtelSharedStorageConnection' &&
      yup.string('Enter your username').required('Username is required'),
    passwordFtelSharedStorage:
      valueType == 'FtelSharedStorageConnection' &&
      yup.string('Enter your password').required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      usernameFtel: '',
      passwordFtel: '',
      usernameFtelSharedStorage: '',
      passwordFtelSharedStorage: '',
      reposistory: '',
      apiKey: '',
      locationFtel: undefined,
      databaseFtel: undefined,
      notificationChannels: []
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {
        type,
        name,
        description,
        database,
        locationFtel,
        databaseFtel,
        host,
        port,
        username,
        password,
        reposistory,
        apiKey,
        usernameFtel,
        passwordFtel,
        usernameFtelSharedStorage,
        passwordFtelSharedStorage,
        notificationChannels
      } = values;
      let formatNotificationChannels = [];
      notificationChannels.length > 0 &&
        notificationChannels.map(item => {
          if (item.type == 'Email')
            formatNotificationChannels.push({
              type: item?.type,
              to: item?.to,
              message: { content: item?.message, type: 'SimpleText' }
            });
          else
            formatNotificationChannels.push({
              type: item?.type,
              botToken: item?.botToken,
              chatId: item?.chatId,
              message: { content: item?.message, type: 'SimpleText' }
            });
        });
      let formatValue = {};
      if (type == 'PostgreSqlConnection')
        formatValue = {
          name,
          description,
          properties: {
            host,
            port: +port,
            database,
            username,
            password: {
              type: 'StringSecret',
              value: password
            },
            type
          }
        };
      else if (type == 'GitLabConnection')
        formatValue = {
          name,
          description,
          properties: {
            host,
            reposistory,
            apiKey: {
              type: 'StringSecret',
              value: apiKey
            },
            type
          }
        };
      else if (type == 'FtelSharedStorageConnection') {
        formatValue = {
          name,
          description,
          properties: {
            username: usernameFtelSharedStorage,
            password: {
              type: 'StringSecret',
              value: passwordFtelSharedStorage
            },
            type
          }
        };
      } else {
        if (isOpen == true) {
          formatValue = {
            name,
            description,
            properties: {
              type,
              database: databaseFtel,
              username: usernameFtel,
              enableUploadFeature: {
                location: locationFtel,
                notificationChannels: formatNotificationChannels
              },
              password: {
                type: 'StringSecret',
                value: passwordFtel
              }
            }
          };
        } else
          formatValue = {
            name,
            description,
            properties: {
              type,
              database: databaseFtel,
              username: usernameFtel,
              password: {
                type: 'StringSecret',
                value: passwordFtel
              }
            }
          };
      }
      dispatch(createConnection(idProject, formatValue));
      setIsOpen(false);
      formik.resetForm();
    }
  });

  const top100Films = [
    { title: 'PostgreSqlConnection' },
    { title: 'FtelLakeHouseConnection' },
    { title: 'GitLabConnection' },
    { title: 'FtelSharedStorageConnection' }
  ];

  const typeNotiChannel = [{ title: 'Email' }, { title: 'Telegram' }];
  React.useEffect(() => {
    setValueType(formik.getFieldMeta('type').value);
  }, [formik]);

  React.useEffect(() => {
    if (Object.keys(formik?.errors).length && formik.isSubmitting) {
      document.getElementById(Object.keys(formik?.errors)[0])?.scrollIntoView();
    }
  }, [formik.errors, formik?.isSubmitting]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box className={classes.boxCustomForm}>
        <TextField
          InputLabelProps={{
            classes: {
              root: classes.cssLabel
            }
          }}
          sx={{ mb: 2 }}
          fullWidth
          id="name"
          name="name"
          label="Name *"
          onKeyPress={event => preventSpecialCharacters(event)}
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          sx={{ mb: 2 }}
          fullWidth
          id="description"
          name="description"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          error={formik.touched.type && Boolean(formik.errors.type)}
        >
          <InputLabel className={classes.cssLabel}>Type *</InputLabel>
          <Select
            id="type"
            name="type"
            label="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {top100Films.map(item => {
              return <MenuItem value={item.title}>{item.title}</MenuItem>;
            })}
          </Select>
          <FormHelperText>
            {formik.touched.type && formik.errors.type}
          </FormHelperText>
        </FormControl>
        {formik.getFieldMeta('type').value == 'PostgreSqlConnection' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="host"
              name="host"
              label="Host *"
              value={formik.values.host}
              onChange={formik.handleChange}
              error={formik.touched.host && Boolean(formik.errors.host)}
              helperText={formik.touched.host && formik.errors.host}
            />
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              type={'number'}
              fullWidth
              id="port"
              name="port"
              label="Port *"
              value={formik.values.port}
              onChange={formik.handleChange}
              error={formik.touched.port && Boolean(formik.errors.port)}
              helperText={formik.touched.port && formik.errors.port}
            />
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="database"
              name="database"
              label="Database *"
              value={formik.values.database}
              onChange={formik.handleChange}
              error={formik.touched.database && Boolean(formik.errors.database)}
              helperText={formik.touched.database && formik.errors.database}
            />
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="username"
              name="username"
              label="Username *"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              type={'password'}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              sx={{ mb: 2 }}
              fullWidth
              id="password"
              name="password"
              label="Password *"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </>
        )}
        {formik.getFieldMeta('type').value == 'FtelLakeHouseConnection' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="usernameFtel"
              name="usernameFtel"
              label="Username *"
              value={formik.values.usernameFtel}
              onChange={formik.handleChange}
              error={
                formik.touched.usernameFtel &&
                Boolean(formik.errors.usernameFtel)
              }
              helperText={
                formik.touched.usernameFtel && formik.errors.usernameFtel
              }
            />
            <TextField
              type={'password'}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              sx={{ mb: 2 }}
              fullWidth
              id="passwordFtel"
              name="passwordFtel"
              label="Password *"
              value={formik.values.passwordFtel}
              onChange={formik.handleChange}
              error={
                formik.touched.passwordFtel &&
                Boolean(formik.errors.passwordFtel)
              }
              helperText={
                formik.touched.passwordFtel && formik.errors.passwordFtel
              }
            />
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="databaseFtel"
              name="databaseFtel"
              label="Database"
              value={formik.values.databaseFtel}
              onChange={formik.handleChange}
            />
            <Box>
              <InputLabel sx={{ m: 2 }}>
                Upload Feature
                <IconButton
                  className={classes.button}
                  sx={{ ml: 1 }}
                  color={open ? 'primary' : 'default'}
                >
                  <Icon
                    onClick={() => {
                      if (isOpen == true) {
                        formik.setFieldValue('locationFtel', '');
                        formik.setFieldValue('notificationChannels', []);
                      }
                      setIsOpenSchedule(!isOpen);
                    }}
                    icon={isOpen == false ? EyeOff : EyeOn}
                    width={20}
                    height={20}
                  />
                </IconButton>
              </InputLabel>
              {isOpen == true && (
                <div>
                  <TextField
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel
                      }
                    }}
                    fullWidth
                    id="locationFtel"
                    name="locationFtel"
                    label="location *"
                    value={formik.values.locationFtel}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.locationFtel &&
                      Boolean(formik.errors.locationFtel)
                    }
                    helperText={
                      formik.touched.locationFtel && formik.errors.locationFtel
                    }
                  />
                  <InputLabel sx={{ m: 2 }}>
                    Notification Channels
                    <IconButton
                      className={classes.button}
                      sx={{ ml: 1 }}
                      color={open ? 'primary' : 'default'}
                    >
                      <Icon
                        onClick={() => {
                          const arrayTemp = [
                            ...formik.values.notificationChannels
                          ];
                          arrayTemp.push({
                            to: [],
                            message: '',
                            type: '',
                            botToken: '',
                            chatId: ''
                          });
                          formik.setFieldValue(
                            'notificationChannels',
                            arrayTemp
                          );
                        }}
                        icon={PlustCircle}
                        width={20}
                        height={20}
                      />
                    </IconButton>
                  </InputLabel>
                  {formik?.values?.notificationChannels?.map((item, index) => {
                    return (
                      <Box className={classes.customBoxNotification}>
                        <Box>
                          <IconButton
                            sx={{ ml: 1 }}
                            color={open ? 'primary' : 'default'}
                          >
                            <Icon
                              onClick={() => {
                                const arrayTemp = [
                                  ...formik.values.notificationChannels
                                ];
                                arrayTemp.splice(index, 1);
                                formik.setFieldValue(
                                  'notificationChannels',
                                  arrayTemp
                                );
                              }}
                              icon={MinusIcon}
                              width={20}
                              height={20}
                            />
                          </IconButton>
                        </Box>
                        <FormControl
                          fullWidth
                          sx={{ mb: 2 }}
                          error={
                            formik?.touched?.notificationChannels?.length &&
                            formik?.errors?.notificationChannels?.length &&
                            formik?.touched?.notificationChannels[index]
                              ?.type &&
                            Boolean(
                              formik?.errors?.notificationChannels[index]?.type
                            )
                          }
                        >
                          <InputLabel>type</InputLabel>
                          <Select
                            name={`notificationChannels[${index}].type`}
                            label="Type"
                            value={item?.type}
                            onChange={formik.handleChange}
                          >
                            {typeNotiChannel?.map(item => {
                              return (
                                <MenuItem value={item.title}>
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        {formik.getFieldMeta(
                          `notificationChannels[${index}].type`
                        ).value == 'Email' && (
                          <>
                            <Autocomplete
                              multiple
                              freeSolo
                              name={`notificationChannels[${index}].to`}
                              onChange={(e, value) => {
                                if (value !== null)
                                  formik.setFieldValue(
                                    `notificationChannels[${index}].to`,
                                    value
                                  );
                                else
                                  formik.setFieldValue(
                                    `notificationChannels[${index}].to`,
                                    []
                                  );
                              }}
                              options={[]}
                              filterSelectedOptions
                              renderTags={(value, getTagProps) =>
                                value?.map((option, index) => (
                                  <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  sx={{ mb: 2 }}
                                  label="To"
                                />
                              )}
                            />
                            <TextField
                              sx={{ mb: 2 }}
                              InputLabelProps={{
                                classes: {
                                  root: classes.cssLabel
                                }
                              }}
                              fullWidth
                              name={`notificationChannels[${index}].message`}
                              label="message *"
                              value={item.message}
                              onChange={formik.handleChange}
                              error={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.message &&
                                Boolean(
                                  formik?.errors?.notificationChannels[index]
                                    ?.message
                                )
                              }
                              helperText={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.message &&
                                formik?.errors?.notificationChannels[index]
                                  ?.message
                              }
                            />
                          </>
                        )}
                        {formik.getFieldMeta(
                          `notificationChannels[${index}].type`
                        ).value == 'Telegram' && (
                          <>
                            <TextField
                              sx={{ mb: 2 }}
                              InputLabelProps={{
                                classes: {
                                  root: classes.cssLabel
                                }
                              }}
                              fullWidth
                              name={`notificationChannels[${index}].message`}
                              label="message *"
                              value={item.message}
                              onChange={formik.handleChange}
                              error={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.message &&
                                Boolean(
                                  formik?.errors?.notificationChannels[index]
                                    ?.message
                                )
                              }
                              helperText={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.message &&
                                formik?.errors?.notificationChannels[index]
                                  ?.message
                              }
                            />
                            <TextField
                              sx={{ mb: 2 }}
                              InputLabelProps={{
                                classes: {
                                  root: classes.cssLabel
                                }
                              }}
                              fullWidth
                              name={`notificationChannels[${index}].botToken`}
                              label="botToken *"
                              value={item.botToken}
                              onChange={formik.handleChange}
                              error={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.botToken &&
                                Boolean(
                                  formik?.errors?.notificationChannels[index]
                                    ?.botToken
                                )
                              }
                              helperText={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.botToken &&
                                formik?.errors?.notificationChannels[index]
                                  ?.botToken
                              }
                            />
                            <TextField
                              sx={{ mb: 2 }}
                              InputLabelProps={{
                                classes: {
                                  root: classes.cssLabel
                                }
                              }}
                              fullWidth
                              name={`notificationChannels[${index}].chatId`}
                              label="chatId *"
                              value={item.chatId}
                              onChange={formik.handleChange}
                              error={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.chatId &&
                                Boolean(
                                  formik?.errors?.notificationChannels[index]
                                    ?.chatId
                                )
                              }
                              helperText={
                                formik?.touched?.notificationChannels?.length &&
                                formik?.errors?.notificationChannels?.length &&
                                formik?.touched?.notificationChannels[index]
                                  ?.chatId &&
                                formik?.errors?.notificationChannels[index]
                                  ?.chatId
                              }
                            />
                          </>
                        )}
                      </Box>
                    );
                  })}
                </div>
              )}
            </Box>
          </>
        )}
        {formik.getFieldMeta('type').value == 'GitLabConnection' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="host"
              name="host"
              label="Host *"
              value={formik.values.host}
              onChange={formik.handleChange}
              error={formik.touched.host && Boolean(formik.errors.host)}
              helperText={formik.touched.host && formik.errors.host}
            />
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="reposistory"
              name="reposistory"
              label="Reposistory *"
              value={formik.values.reposistory}
              onChange={formik.handleChange}
              error={
                formik.touched.reposistory && Boolean(formik.errors.reposistory)
              }
              helperText={
                formik.touched.reposistory && formik.errors.reposistory
              }
            />
            <TextField
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              sx={{ mb: 2 }}
              fullWidth
              id="apiKey"
              name="apiKey"
              label="ApiKey *"
              value={formik.values.apiKey}
              onChange={formik.handleChange}
              error={formik.touched.apiKey && Boolean(formik.errors.apiKey)}
              helperText={formik.touched.apiKey && formik.errors.apiKey}
            />
          </>
        )}
        {formik.getFieldMeta('type').value == 'FtelSharedStorageConnection' && (
          <>
            <TextField
              sx={{ mb: 2 }}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              fullWidth
              id="usernameFtelSharedStorage"
              name="usernameFtelSharedStorage"
              label="Username *"
              value={formik.values.usernameFtelSharedStorage}
              onChange={formik.handleChange}
              error={
                formik.touched.usernameFtelSharedStorage &&
                Boolean(formik.errors.usernameFtelSharedStorage)
              }
              helperText={
                formik.touched.usernameFtelSharedStorage &&
                formik.errors.usernameFtelSharedStorage
              }
            />
            <TextField
              type={'password'}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              sx={{ mb: 2 }}
              fullWidth
              id="passwordFtelSharedStorage"
              name="passwordFtelSharedStorage"
              label="Password *"
              value={formik.values.passwordFtelSharedStorage}
              onChange={formik.handleChange}
              error={
                formik.touched.passwordFtelSharedStorage &&
                Boolean(formik.errors.passwordFtelSharedStorage)
              }
              helperText={
                formik.touched.passwordFtelSharedStorage &&
                formik.errors.passwordFtelSharedStorage
              }
            />
          </>
        )}
      </Box>
      <Box className={classes.BoxCustomButton}>
        <Button
          className="btn-cancel"
          color="inherit"
          variant="contained"
          onClick={() => {
            setIsOpen(false);
            formik.resetForm();
          }}
        >
          Cancel
        </Button>
        <Button color="primary" variant="contained" type="submit">
          <ClipLoader
            css={{
              margin: '2px'
            }}
            loading={isLoading}
            speedMultiplier={1}
          />
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default FormAddConnection;
