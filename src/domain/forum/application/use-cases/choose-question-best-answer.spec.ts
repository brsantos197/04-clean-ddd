import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })
  it('should be able choose the best answer', async () => {
    const question = makeQuestion()

    const awnser = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(awnser)

    await sut.execute({
      answerId: awnser.id.toString(),
      authorId: question.authorId.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(awnser.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    const awnser = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(awnser)

    await sut.execute({
      answerId: awnser.id.toString(),
      authorId: question.authorId.toString(),
    })

    await expect(() => {
      return sut.execute({
        answerId: awnser.id.toString(),
        authorId: 'author-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
