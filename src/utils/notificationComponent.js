import { size } from 'lodash';
import { toast } from 'react-toastify';

export const openNotificationWithIcon = (status, key) => {
  switch (status) {
    case 200:
      return toast.success(key, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    case 400:
    case 401:
    case 402:
    case 500:
      return toast.error(key, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          'font-size': 13
        }
      });

    default:
      return toast.warning(key, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
  }
};
