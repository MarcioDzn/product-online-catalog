import Slider from "@mui/material/Slider";
import { useId, useState, useEffect } from "react";
import Input from "../Input";

interface FieldRangeSliderProps { 
  title?: string
  value: number[] | number
  min: number
  max: number
  valuetext: (value: number) => string
  onChange: (e: Event, range: number[]) => void
  onApply: () => void;
  valueFormatter?: (value: number) => string
  valueParser?: (value: string) => number
  maskInput?: (raw: string) => { text: string; numeric: number }
}

export default function FieldRangeSlider({
  title, 
  value, 
  min, 
  max,
  valuetext, 
  onChange,
  onApply,
  valueFormatter,
  valueParser,
  maskInput
}: FieldRangeSliderProps) {
  const inputId = useId();

  const formatValue = (val: number) =>
    valueFormatter ? valueFormatter(val) : String(val);

  const parseValue = (raw: string) =>
    valueParser ? valueParser(raw) : Number(raw);

  const [minText, setMinText] = useState(
    Array.isArray(value) ? formatValue(value[0]) : ""
  );
  const [maxText, setMaxText] = useState(
    Array.isArray(value) ? formatValue(value[1]) : ""
  );
  const [minNumeric, setMinNumeric] = useState(
    Array.isArray(value) ? value[0] : 0
  );
  const [maxNumeric, setMaxNumeric] = useState(
    Array.isArray(value) ? value[1] : 0
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      setMinText(formatValue(value[0]));
      setMaxText(formatValue(value[1]));
      setMinNumeric(value[0]);
      setMaxNumeric(value[1]);
    }
  }, [Array.isArray(value) ? value[0] : null, Array.isArray(value) ? value[1] : null]);

  const handleChange = (e: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onChange(e, newValue);
    }
  };

  // filtra tudo que não é dígito
  const defaultMask = (raw: string): { text: string; numeric: number } => {
    const digitsOnly = raw.replace(/\D/g, "");
    const numeric = digitsOnly ? Number(digitsOnly) : 0;
    return { text: digitsOnly, numeric };
  };

  const applyMask = maskInput ?? defaultMask;

  const handleMinInputChange = (raw: string) => {
      if (valueParser) {
        const { text, numeric } = applyMask(raw);
        setMinText(text);
        setMinNumeric(numeric);
      } else {
        const digitsOnly = raw.replace(/\D/g, "");
        setMinText(digitsOnly);
        setMinNumeric(digitsOnly ? Number(digitsOnly) : 0);
      }
  };

  const handleMaxInputChange = (raw: string) => {
      if (valueParser) {
        const { text, numeric } = applyMask(raw);
        setMaxText(text);
        setMaxNumeric(numeric);
      } else {
        const digitsOnly = raw.replace(/\D/g, "");
        setMaxText(digitsOnly);
        setMaxNumeric(digitsOnly ? Number(digitsOnly) : 0);
      }
  };

  const commitMin = () => {
    if (Array.isArray(value)) {
      const finalValue = valueParser ? minNumeric : parseValue(minText);
      onChange(new Event("change"), [finalValue, value[1]]);
    }
    onApply();
  };

  const commitMax = () => {
    if (Array.isArray(value)) {
      const finalValue = valueParser ? maxNumeric : parseValue(maxText);
      onChange(new Event("change"), [value[0], finalValue]);
    }
    onApply();
  };

  return (
      <div className="flex flex-col gap-2 h-full">
        {
          title && <span className="font-bold">{title}</span>
        }
        
        <Slider
          getAriaLabel={() => title ? title : ""}
          value={value}
          onChange={handleChange}
          onChangeCommitted={onApply}
          valueLabelDisplay="off"
          getAriaValueText={valuetext}
          min={min}
          max={max}
          sx={{
            color: "#000",
            width: "calc(100% - 16px)",
            marginLeft: "8px",

            "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
                backgroundColor: "#fff",
                border: "2px solid #000",
                boxShadow: "none",

                "&:hover": {
                    boxShadow: "none",
                },

                "&:focus": {
                    boxShadow: "none",
                },

                "&.Mui-focusVisible": {
                    boxShadow: "none",
                },

                "&.Mui-active": {
                    boxShadow: "none",
                },

                "&::before": {
                    display: "none",
                },

                "&::after": {
                    display: "none",
                },
            },

            "& .MuiSlider-rail": {
                left: "-8px",
                width: "calc(100% + 16px)",
            },
        }}
        />

        {
          Array.isArray(value) &&
          <div className="flex flex-row justify-between gap-4 items-center">
              <Input 
                id={`${inputId}-min-value-input`}
                placeholder="Valor mínimo"
                value={minText}
                onChange={handleMinInputChange}
                onBlur={commitMin}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commitMin();
                }}
                className="text-xs rounded-sm"
              />

              <Input 
                id={`${inputId}-max-value-input`}
                placeholder="Valor máximo"
                value={maxText}
                onChange={handleMaxInputChange}
                onBlur={commitMax}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commitMax();
                }}
                className="text-xs rounded-sm"
              />
          </div>
        }
    </div>
  )
}