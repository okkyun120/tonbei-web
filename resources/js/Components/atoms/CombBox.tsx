import React from "react";

import { makeStyles } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const useStyles = makeStyles((theme: any) => ({
  formControl: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(5),
  },
}));

export interface ComboBoxItem {
  id: string;
  value: string;
}

type Props = {
  inputLabel: string;
  items: ComboBoxItem[];
  defaultValue: string;
  value: string;
  onChange: (selected: string) => void;
};

const ComboBox: React.FC<Props> = (props) => {
  const { inputLabel, items, value, defaultValue, onChange } = props;
  //const classes = useStyles();

  return (
    //<FormControl className={classes.formControl}>
    <FormControl >
      <InputLabel>{inputLabel}</InputLabel>
      <Select
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          if (e.target.value !== undefined) {
            onChange(e.target.value as string);
          }
        }}
      >
        {items.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ComboBox;