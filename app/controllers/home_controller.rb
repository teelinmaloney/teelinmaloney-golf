require 'nokogiri'
require 'open-uri'

class HomeController < ApplicationController
  def index
    @rounds = Rails.cache.fetch("rounds", expires_in: 5.minutes) do
      fetch_rounds
    end
    respond_to do |format|
      format.html
      format.json { render json: @rounds }
    end
  end

  private

  def fetch_rounds
    page = 1
    fields = []
    rows = []
    loop do
      doc = Nokogiri::HTML(open("https://shotzoom.com/27565334750/golf?p=#{page}&c=RoundStartDateTime&o=desc"))
      if page == 1
        doc.xpath("//table/thead/tr").each do |row|
          fields = row.xpath("th").map do |col|
            col.text.strip!
          end
        end
      end
      doc.xpath("//table/tbody/tr").each do |row|
        data = {}
        row.xpath("td").each_with_index do |col, i|
          data[fields[i]] = col.text.strip!
        end
        rows << data
      end
      break if page >= 4
      page += 1
    end
    rows
  end
end
