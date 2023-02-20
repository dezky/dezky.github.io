export const formatNumber = (n: number) => new Intl.NumberFormat().format(n);

export const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

// This function is similar to `toFixed` but returns a number instead of a string.
// Also it is said that it is more performatic than `toFixed`
export const round = (value: number, precision = 0) => {
    const multiplier = 10 ** precision;
    return Math.round(value * multiplier) / multiplier;
};

export const percentage = (total: number, n: number, options?: { round?: boolean; precision?: number }) => {
    const { round: shouldRound = true, precision } = options ?? {};
    let value = total === 0 ? 0 : (n / total) * 100;
    if (shouldRound) {
        value = round(value, precision);
    }
    return `${formatNumber(value)}%`;
};
