import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  it('should be able to delete a answer', async () => {
    const answerId = 'answer-1'
    const authorId = 'author-1'
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId(authorId),
      },
      new UniqueEntityId(answerId),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      answerId,
      authorId,
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const answerId = 'answer-1'
    const authorId = 'author-1'
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId(authorId),
      },
      new UniqueEntityId(answerId),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    await expect(() => {
      return sut.execute({
        answerId,
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
