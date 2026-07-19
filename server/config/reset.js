import './dotenv.js'
import { pool } from './database.js'
import unitsData from '../data/units.js'
import usersData from '../data/users.js'
import maintenanceRequestsData from '../data/maintenanceRequests.js'
import requestAssignmentsData from '../data/requestAssignments.js'

const createTablesQuery = `
    DROP TABLE IF EXISTS request_assignment;
    DROP TABLE IF EXISTS maintenance_request;
    DROP TABLE IF EXISTS "user";
    DROP TABLE IF EXISTS unit;

    DROP TYPE IF EXISTS status;
    DROP TYPE IF EXISTS category;
    DROP TYPE IF EXISTS unit_status;
    DROP TYPE IF EXISTS user_role;
    DROP TYPE IF EXISTS urgency;

    CREATE TYPE unit_status AS ENUM ('occupied', 'vacant', 'under_maintenance', 'inactive');
    CREATE TYPE user_role AS ENUM ('tenant', 'technician', 'manager');
    CREATE TYPE category AS ENUM ('plumbing', 'hvac', 'electrical', 'carpentry');
    CREATE TYPE urgency AS ENUM ('low', 'medium', 'high');
    CREATE TYPE status AS ENUM ('submitted', 'assigned', 'in_progress', 'completed', 'cancelled');

    CREATE TABLE unit (
        id SERIAL PRIMARY KEY,
        status unit_status NOT NULL,
        unit_number VARCHAR(50) NOT NULL UNIQUE,
        floor INTEGER NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms DECIMAL NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "user" (
        id SERIAL PRIMARY KEY,
        unit_id INTEGER REFERENCES unit(id),
        full_name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        hashed_password VARCHAR(255) NOT NULL,
        role user_role NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE maintenance_request (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES "user"(id),
        unit_id INTEGER NOT NULL REFERENCES unit(id),
        category category NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        urgency urgency NOT NULL,
        status status NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closing_notes VARCHAR(255)
    );

    CREATE TABLE request_assignment (
        id SERIAL PRIMARY KEY,
        request_id INTEGER NOT NULL REFERENCES maintenance_request(id),
        technician_id INTEGER NOT NULL REFERENCES "user"(id),
        status status NOT NULL,
        assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        estimated_completion_date TIMESTAMP
    );
`

async function createTables() {
    await pool.query(createTablesQuery)
    console.log('tables created successfully')
}

async function seedUnits() {
    const insertQuery = `
        INSERT INTO unit (id, status, unit_number, floor, bedrooms, bathrooms)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
    for (const unit of unitsData) {
        await pool.query(insertQuery, [
            unit.id,
            unit.status,
            unit.unit_number,
            unit.floor,
            unit.bedrooms,
            unit.bathrooms,
        ])
    }
    console.log('unit seeded successfully')
}

async function seedUsers() {
    const insertQuery = `
        INSERT INTO "user" (id, unit_id, full_name, email, hashed_password, role)
        VALUES ($1, $2, $3, $4, $5, $6)
    `
    for (const user of usersData) {
        await pool.query(insertQuery, [
            user.id,
            user.unit_id,
            user.full_name,
            user.email,
            user.hashed_password,
            user.role,
        ])
    }
    console.log('user seeded successfully')
}

async function seedMaintenanceRequests() {
    const insertQuery = `
        INSERT INTO maintenance_request (id, tenant_id, unit_id, category, title, description, urgency, status, resolved_at, closing_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    for (const request of maintenanceRequestsData) {
        await pool.query(insertQuery, [
            request.id,
            request.tenant_id,
            request.unit_id,
            request.category,
            request.title,
            request.description,
            request.urgency,
            request.status,
            request.resolved_at,
            request.closing_notes,
        ])
    }
    console.log('maintenance_request seeded successfully')
}

async function seedRequestAssignments() {
    const insertQuery = `
        INSERT INTO request_assignment (id, request_id, technician_id, status, estimated_completion_date)
        VALUES ($1, $2, $3, $4, $5)
    `
    for (const assignment of requestAssignmentsData) {
        await pool.query(insertQuery, [
            assignment.id,
            assignment.request_id,
            assignment.technician_id,
            assignment.status,
            assignment.estimated_completion_date,
        ])
    }
    console.log('request_assignment seeded successfully')
}

async function syncSequences() {
    await pool.query(`SELECT setval('unit_id_seq', (SELECT MAX(id) FROM unit))`)
    await pool.query(`SELECT setval('user_id_seq', (SELECT MAX(id) FROM "user"))`)
    await pool.query(`SELECT setval('maintenance_request_id_seq', (SELECT MAX(id) FROM maintenance_request))`)
    await pool.query(`SELECT setval('request_assignment_id_seq', (SELECT MAX(id) FROM request_assignment))`)
}

async function reset() {
    try {
        await createTables()
        await seedUnits()
        await seedUsers()
        await seedMaintenanceRequests()
        await seedRequestAssignments()
        await syncSequences()
        console.log('database reset and seeded successfully')
    } catch (err) {
        console.error('error resetting database', err)
    } finally {
        await pool.end()
    }
}

reset()
