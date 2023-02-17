export const defaultStyle = {
  width: '100%',
  height: 400
};

export const commonOptions = (
  show,
  options = {
    title: 'No data'
  }
) => {
  return {
    title: {
      show,
      textStyle: {
        color: 'grey',
        fontSize: 20
      },
      text: options.title,
      left: 'center',
      top: 'center'
    }
  };
};
