import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'
import { CreateQuestionUseCase } from './create-question'

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (question: Question) => {},
}

test('create a question', async () => {
  const answerQuestion = new CreateQuestionUseCase(fakeQuestionsRepository)

  const { question } = await answerQuestion.execute({
    authorId: '1',
    title: 'Nova pergunta',
    content: 'Conteúdo da pergunta',
  })

  expect(question.id).toBeTruthy()
})
