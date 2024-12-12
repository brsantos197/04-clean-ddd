import { QuestionsRepository } from '../repositories/question-repository'

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found!')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('You do not have permission to delete this question.')
    }

    await this.questionsRepository.delete(question)

    return {}
  }
}
