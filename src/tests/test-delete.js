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

    describe('DELETE /api/notes/:id', () => {
        it('should return 200 and confirmation when a note is deleted', async () => {
            const deletedNote = { title: 'Test Note', content: 'Test Content' };

            sinon.stub(noteController, 'delete').resolves(deletedNote);

            const response = await request.delete('/api/notes/1');

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Note deleted successfully');
        });

        it('should return 404 if the note does not exist', async () => {
            sinon.stub(noteController, 'delete').resolves(null);

            const response = await request.delete('/api/notes/999');

            expect(response.status).to.equal(404);
            expect(response.body).to.have.property('message', 'Note not found');
        });
    });
});
