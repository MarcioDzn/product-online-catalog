export type InputMaskMode =
    | "integer"
    | "float"
    | "currency"
    | "phone";

export function filterInteger(inputValue: string): string {
    return inputValue.replace(/\D/g, "");
}

export function filterFloat(
    inputValue: string,
    maxDecimals = 2
): string {
    let clean = inputValue
        .replace(".", ",")
        .replace(/[^0-9,]/g, "");

    const [intPart, ...rest] = clean.split(",");

    if (rest.length === 0) {
        return intPart;
    }

    const decimalPart = rest.join("").slice(0, maxDecimals);

    return `${intPart},${decimalPart}`;
}

export function filterCurrency(inputValue: string): string {
    const digits = inputValue.replace(/\D/g, "");

    if (!digits) {
        return "";
    }

    return (Number(digits) / 100).toFixed(2);
}

export function filterPhone(inputValue: string): string {
    let digits = inputValue.replace(/\D/g, "");

    if (digits.startsWith("55")) {
        digits = digits.slice(2);
    }

    digits = digits.slice(0, 11);

    if (!digits) {
        return "";
    }

    if (digits.length <= 2) {
        return `+55 (${digits}`;
    }

    if (digits.length <= 7) {
        return `+55 (${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `+55 (${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function applyMask(
    mode: InputMaskMode | undefined,
    value: string
): string {
    switch (mode) {
        case "integer":
            return filterInteger(value);

        case "float":
            return filterFloat(value);

        case "currency":
            return filterCurrency(value);

        case "phone":
            return filterPhone(value);

        default:
            return value;
    }
}

export function getInputModeFor(
    mode: InputMaskMode | undefined
): "numeric" | "decimal" | "text" {
    if (mode === "integer" || mode === "phone") {
        return "numeric";
    }

    if (mode === "float" || mode === "currency") {
        return "decimal";
    }

    return "text";
}
