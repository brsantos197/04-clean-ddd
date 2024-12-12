import { AnswersRepository } from '../repositories/answers-repository'
import { AnserQuestionUseCase } from './answer-question'

const fakeAnswersRepository: AnswersRepository = {
  create: async () => {},
}

test('create an answer', async () => {
  const answerQuestion = new AnserQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta',
  })

  expect(answer.content).toEqual('Nova resposta')
})
