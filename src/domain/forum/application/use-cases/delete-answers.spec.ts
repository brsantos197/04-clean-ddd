import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

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
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(answerId),
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
        authorId: new UniqueEntityID(authorId),
      },
      new UniqueEntityID(answerId),
    )

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId,
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
