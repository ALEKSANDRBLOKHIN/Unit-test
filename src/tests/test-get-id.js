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

    describe('GET /api/notes/:id', () => {
        it('should return a single note if found', async () => {
            const mockNote = { title: 'Test Note', content: 'Test Content' };

            sinon.stub(noteController, 'findOne').resolves(mockNote);

            const response = await request.get('/api/notes/1');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Note fetched successfully');
            expect(response.body).to.have.property('note').that.includes(mockNote);
        });

        it('should return 404 if note is not found', async () => {
            sinon.stub(noteController, 'findOne').resolves(null);

            const response = await request.get('/api/notes/999');

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Note not found');
        });
    });
});
