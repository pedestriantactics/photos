

export const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;


export type DateLiteral = `${number}-${number}-${number}`;

export const DateLiteral = {
    now(): DateLiteral {
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}` as DateLiteral;
    },

    from(date: Date): DateLiteral {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}` as DateLiteral;
    }
}
