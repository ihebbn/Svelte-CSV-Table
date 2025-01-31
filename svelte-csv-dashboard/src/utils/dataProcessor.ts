// src/utils/dataProcessor.ts
export function processData(
    data: Record<string, any>[],
    sortConfig: { column: string | null; direction: 'asc' | 'desc' },
    filters: Record<string, { type: string; value: string }>
): Record<string, any>[] {
    
    if (!data || data.length === 0) return []; // Return an empty array if no data

    let processedData = [...data]; // Copy data to avoid mutating original

    // 🔹 Apply filters
    Object.keys(filters).forEach((column) => {
        const { type, value } = filters[column];

        if (!value) return; // Skip empty filters

        processedData = processedData.filter((row) => {
            const cellValue = row[column]?.toString().toLowerCase() || '';

            switch (type) {
                case 'contains':
                    return cellValue.includes(value.toLowerCase());
                case 'exact':
                    return cellValue === value.toLowerCase();
                case '>':
                    return !isNaN(parseFloat(cellValue)) && parseFloat(cellValue) > parseFloat(value);
                case '<':
                    return !isNaN(parseFloat(cellValue)) && parseFloat(cellValue) < parseFloat(value);
                case 'regex':
                    try {
                        return new RegExp(value, 'i').test(cellValue);
                    } catch (error) {
                        return false; // Invalid regex
                    }
                default:
                    return true;
            }
        });
    });

    // 🔹 Apply sorting
    if (sortConfig.column) {
        const { column, direction } = sortConfig;
        processedData.sort((a, b) => {
            const valueA = a[column] ?? '';
            const valueB = b[column] ?? '';

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return direction === 'asc' ? valueA - valueB : valueB - valueA;
            } else {
                return direction === 'asc'
                    ? valueA.toString().localeCompare(valueB.toString())
                    : valueB.toString().localeCompare(valueA.toString());
            }
        });
    }

    return processedData;
}
