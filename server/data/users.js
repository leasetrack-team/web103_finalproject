// hashed_password values are placeholders, not real bcrypt hashes — replace once auth is implemented.
const usersData = [
    { id: 1, unit_id: 1, full_name: 'Maria Gomez', email: 'maria.gomez@example.com', hashed_password: 'placeholder_hash_1', role: 'tenant' },
    { id: 2, unit_id: 2, full_name: 'John Smith', email: 'john.smith@example.com', hashed_password: 'placeholder_hash_2', role: 'tenant' },
    { id: 3, unit_id: 5, full_name: 'Ana Torres', email: 'ana.torres@example.com', hashed_password: 'placeholder_hash_3', role: 'tenant' },
    { id: 4, unit_id: null, full_name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', hashed_password: 'placeholder_hash_4', role: 'technician' },
    { id: 5, unit_id: null, full_name: 'David Lee', email: 'david.lee@example.com', hashed_password: 'placeholder_hash_5', role: 'technician' },
    { id: 6, unit_id: null, full_name: 'Laura Kim', email: 'laura.kim@example.com', hashed_password: 'placeholder_hash_6', role: 'manager' },
]

export default usersData
