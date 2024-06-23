export function formatName(name, maxNameLength) {
    const displayName = name.officialFullName.length > 2 * maxNameLength
        ? name.lastNameAndInitials
        : name.officialFullName;

    const lastNameLength = name.lastName.length;
    if (lastNameLength > maxNameLength && name.lastName.charAt(maxNameLength - 1) !== ' ') {
        return displayName.slice(0, maxNameLength - 1) + '-' + displayName.slice(maxNameLength - 1);
    }

    return displayName;
}

export function generateEmptyRows(beginIndex, endIndex, length) {
    if (beginIndex > endIndex) return [];
    const emptyRow = Array(length).fill({});

    return [...Array.from(
        {length: endIndex - beginIndex},
        (_, i) => [{text: (i + beginIndex + 1), style: 'rowNumber'},
            ...emptyRow]
    )];
}