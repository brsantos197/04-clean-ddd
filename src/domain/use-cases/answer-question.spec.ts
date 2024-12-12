import { expect, test } from 'vitest'
import { AnserQuestionUseCase } from './answer-question'

test('create an answer', () => {
  const answerQuestion = new AnserQuestionUseCase()

  const answer = answerQuestion.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Nova resposta'
  })

  expect(answer.content).toEqual('Nova resposta')
})