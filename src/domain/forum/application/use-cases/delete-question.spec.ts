import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should be able to delete a question', async () => {
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
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
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
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
