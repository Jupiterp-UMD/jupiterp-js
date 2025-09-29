/**
 * A deptList response row.
 */
export interface DepartmentRaw {
    dept_code: string;
    name: string;
}

/**
 * A department
 */
export interface Department {
    deptCode: string;
    name: string;
}