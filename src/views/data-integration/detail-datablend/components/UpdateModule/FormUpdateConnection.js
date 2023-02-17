import {
  TextField,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  Chip,
  Autocomplete
} from '@mui/material';
import { Icon } from '@iconify/react';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckEdit, updateConnection } from '~/redux/slices/project';
import { preventSpecialCharacters } from '~/utils/preventSpecialCharacters';
import { isObject } from 'lodash';
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

const FormUpdateConnection = ({ setIsOpen, idProject, keyMessage }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { isLoading, diDetail } = useSelector(state => state.project);
  //state
  const [valueType, setValueType] = React.useState('');
  const [isOpen, setIsOpenSchedule] = React.useState(false);

  const validationSchema = yup.object({
    name: yup.string('Enter your Name').required('Name is required'),
    type: yup.string('Enter your type').required('Type is required'),
    username:
      valueType == 'FtelLakeHouseConnection'
        ? yup.string('Enter your username').required('Username is required')
        : valueType == 'FtelSharedStorageConnection'
        ? yup.string('Enter your username').required('Username is required')
        : valueType == 'PostgreSqlConnection'
        ? yup.string('Enter your username').required('Username is required')
        : '',
    password:
      valueType == 'FtelLakeHouseConnection'
        ? yup.string('Enter your username').required('Username is required')
        : valueType == 'FtelSharedStorageConnection'
        ? yup.string('Enter your username').required('Username is required')
        : valueType == 'PostgreSqlConnection'
        ? yup.string('Enter your username').required('Username is required')
        : '',
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
    reposistory:
      valueType == 'GitLabConnection' &&
      yup.string('Enter your reposistory').required('Reposistory is required'),
    apiKey:
      valueType == 'GitLabConnection' &&
      yup.string('Enter your apiKey').required('ApiKey is required'),
    location:
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
    )
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: '',
      username: '',
      password: '',
      host: '',
      reposistory: '',
      apiKey: '',
      port: '',
      database: '',
      location: '',
      notificationChannels: [],
      location: undefined
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const {
        name,
        description,
        type,
        username,
        password,
        host,
        reposistory,
        apiKey,
        port,
        database,
        location,
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
            username,
            password: {
              type: 'StringSecret',
              value: password
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
              database,
              username,
              enableUploadFeature: {
                location: location,
                notificationChannels: formatNotificationChannels
              },
              password: {
                type: 'StringSecret',
                value: password
              }
            }
          };
        } else
          formatValue = {
            name,
            description,
            properties: {
              type,
              database,
              username,
              password: {
                type: 'StringSecret',
                value: password
              }
            }
          };
      }
      dispatch(updateConnection(idProject, diDetail?.id, formatValue));
      setIsOpen(false);
    }
  });

  const arrType = [
    { title: 'PostgreSqlConnection' },
    { title: 'FtelLakeHouseConnection' },
    { title: 'GitLabConnection' },
    { title: 'FtelSharedStorageConnection' }
  ];
  const typeNotiChannel = [{ title: 'Email' }, { title: 'Telegram' }];

  React.useEffect(() => {
    formik.setFieldValue('name', diDetail?.name);
    formik.setFieldValue('description', diDetail?.description);
    if (isObject(diDetail?.properties)) {
      Object?.keys(diDetail?.properties).forEach(function(key, index) {
        if (key == 'password')
          formik.setFieldValue(key, diDetail?.properties[key]?.value);
        else if (key == 'apiKey')
          formik.setFieldValue(key, diDetail?.properties[key]?.value);
        else formik.setFieldValue(key, diDetail?.properties[key]);
      });
    }
    if (
      diDetail?.properties?.type == 'FtelLakeHouseConnection' &&
      isObject(diDetail?.properties?.enableUploadFeature)
    ) {
      let formatNotificationChannels = [];
      if (
        diDetail?.properties?.enableUploadFeature?.notificationChannels
          ?.length > 0
      )
        diDetail?.properties?.enableUploadFeature?.notificationChannels.map(
          item => {
            if (item.type == 'Email')
              formatNotificationChannels.push({
                type: item?.type,
                to: item?.to,
                message: item?.message?.content
              });
            else
              formatNotificationChannels.push({
                type: item?.type,
                botToken: item?.botToken,
                chatId: item?.chatId,
                message: item?.message?.content
              });
          }
        );
      setIsOpenSchedule(true);
      formik.setFieldValue(
        'location',
        diDetail?.properties?.enableUploadFeature?.location
      );
      formik.setFieldValue('notificationChannels', formatNotificationChannels);
    }
  }, [diDetail]);

  React.useEffect(() => {
    setValueType(formik.getFieldMeta('type').value);
  }, [formik]);

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
        />
        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          error={formik.touched.type && Boolean(formik.errors.type)}
        >
          <InputLabel className={classes.cssLabel}>Type *</InputLabel>
          <Select
            disabled
            id="type"
            name="type"
            label="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {arrType.map(item => {
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
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              id="database"
              name="database"
              label="Database"
              value={formik.values.database}
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
                        formik.setFieldValue('location', '');
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
                    id="location"
                    name="location"
                    label="location *"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                    helperText={
                      formik.touched.location && formik.errors.location
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
      </Box>
      <Box className={classes.BoxCustomButton}>
        <Button
          color="inherit"
          variant="contained"
          className="btn-cancel"
          onClick={() => {
            setIsOpen(false);
            dispatch(updateCheckEdit(false));
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

export default FormUpdateConnection;
