import { format, parse } from "date-fns";

export function formatDate(dateString) {
    const date = parse(dateString, "yyyyMMdd", new Date());
    return format(date, "yyyy-MM-dd");
}
