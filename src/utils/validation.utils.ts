export const prettierErrorMessage = error => {
    try {
        if (error.constraints) {
            if (error.constraints.unknownValue) {
                return `constraints:${JSON.stringify(error.constraints)}, target:${JSON.stringify(error.target)}`;
            }
            return `key:${error.property}, value:${error.value}, constraints:${JSON.stringify(error.constraints)}`;
        } else if (error.children && error.children.length > 0) {
            return error.children.map(prettierErrorMessage).join('; ');
        }
    } catch (e) {}

    return JSON.stringify(error);
};