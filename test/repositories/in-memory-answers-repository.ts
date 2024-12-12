import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository {
  public items: Answer[] = []

  async create(answer: Answer) {
    this.items.push(answer)
  }
}
