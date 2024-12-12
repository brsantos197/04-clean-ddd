import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should be able to edit a question', async () => {
    const questionId = 'question-1'
    const authorId = 'author-1'
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId(authorId),
      },
      new UniqueEntityId(questionId),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      questionId,
      authorId,
      title: 'New title',
      content: 'New content',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const questionId = 'question-1'
    const authorId = 'author-1'
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId(authorId),
      },
      new UniqueEntityId(questionId),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    await expect(() => {
      return sut.execute({
        questionId,
        authorId: 'author-2',
        title: 'New title',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
