module WordsHelper

  HITCHHIKER = File.new(Rails.root.to_s + "/public/hitchhiker.txt").read.gsub!("\n", " ")
  HITCHHIKER_WORDS = HITCHHIKER.downcase.gsub("\'", "").scan(/\w+/)

  # Find the frequency of a given word in the text.
  def self.frequency_of(word)
    count = 0
    word.downcase!
    HITCHHIKER.downcase.scan(/\w+/).each { |str| count += 1 if (str == word) }
    count
  end

  # Returns a hash table of all the words and how many times each was used like { "the" => 15045 }, ...
  def self.word_usage_counts
    HITCHHIKER.gsub("\'", "").scan(/\w+/).each_with_object(Hash.new(0)) { |w, h| h[w.downcase] += 1 }
  end

  # Returns the all words sorted by frequency.
  def self.word_usage_sorted_by_frequency
    WordsHelper.word_usage_counts.sort_by { |k, v| v }.map { |tuple| { tuple[0] => tuple[1] } }.reverse
  end

  # Returns first word starting with query.
  def self.auto_complete(query)
    query.downcase!
    sorted_words = Rails.cache.fetch('sorted_words') do
      WordsHelper.word_usage_sorted_by_frequency
    end
    return "" if query.blank?
    sorted_words.each { |k, v|
      key = k.keys[0]
      return key if key.index(query) == 0 && key != query
    }
    return ""
  end
end
