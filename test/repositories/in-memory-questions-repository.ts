import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository {
  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)
  }
}
