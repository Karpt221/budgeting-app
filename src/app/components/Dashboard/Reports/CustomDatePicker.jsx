import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from './Reports.module.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
function CustomDatePicker({ label, defaultValue = '', fieldName }) {
  return (
    <FormControl
      
      sx={{ m: 0, width: 150, backgroundColor: 'white' }}
    >
      <DatePicker
        id={styles.datePicker}
        label={label}
        defaultValue={dayjs(defaultValue)}
        format="YYYY-MM"
        name={fieldName}
        slots={{ textField: TextField }}
        views={['year', 'month']}
        slotProps={{
          textField: {
            size: 'small',
            sx: {
              margin: 0,
              padding: 0,
              backgroundColor: 'white',
              '& .MuiFormLabel-root': { fontSize: '18px' },
              '& .MuiInputBase-input': { fontSize: '18px' },
              '& .MuiSvgIcon-root': { fontSize: '25px' },
            },
          },
        }}
      />
    </FormControl>
  );
}

export default CustomDatePicker;
