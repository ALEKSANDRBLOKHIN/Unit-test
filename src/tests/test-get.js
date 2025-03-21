const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');

const noteRoutes = require('../routes/note.routes');
const noteController = require('../controllers/note.controller');

const { expect } = chai;

const app = express();
app.use(express.json());
app.use('/api', noteRoutes);

describe('Note Routes', () => {
    let request;

    before(() => {
        request = supertest(app);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/notes', () => {
        it('should return all notes', async () => {
            const mockNotes = [
                { title: 'Test Note', content: 'Test Content' }
            ];

            sinon.stub(noteController, 'findAll').resolves(mockNotes);

            const response = await request.get('/api/notes');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Notes fetched successfully');
            expect(response.body).to.have.property('notes').that.is.an('array').that.deep.equals(mockNotes);
        });
    });
});
