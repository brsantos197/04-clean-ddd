import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })
  it('should be able to edit a answer', async () => {
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
      content: 'New content',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'New content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
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
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
