export class Slug {
  public value: string
  constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalizes it as a slug
   *
   * @example
   *
   * const slug = Slug.createFromText('Example title')
   *
   * return 'example-title'
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
