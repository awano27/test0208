Alright, I need to implement the skill_evaluator.ts file based on the given requirements. Let's start by understanding the structure provided in the YAML. The file is part of the skill_analysis directory and has dependencies on the review_crawler.py in data_collection. 

First, the analysis targets are Hard Skills, Soft Skills, and Industry-specific Skills. The evaluation metrics include Skill Level, Years of Experience, Comparison with Industry Average, and Recommended Career Path. The agent chosen is deepseek-reasoner, which is good for complex skill analysis.

Since it's a TypeScript file, I'll define interfaces for the skill data. The SkillData interface should include skillType (hard, soft, industry), skillLevel (number), yearsOfExperience (number), and industryAverage (number). 

Next, the SkillEvaluator class needs to handle these metrics. The constructor will take SkillData and industryAverages. The evaluate method will process each skill. For each skill, calculate the comparison with the industry average. Then, determine the career path recommendation based on the skill's level and experience. 

For career path recommendations, I'll use a series of conditional checks. If the skill level is above average and experience is high, suggest a leadership role. If level is high but experience is low, recommend specialized training. If level is below average, suggest foundational courses. Industry-specific skills might have different recommendations, like certifications or networking.

I should also include a method to get all evaluations, returning an array of results with each skill's details and recommendations. 

Dependencies mention the review_crawler.py, which probably provides the data. Since this is TypeScript, I'll assume the data is imported or passed in appropriately. 

Need to make sure all the evaluation metrics are covered. The code should be clean, with minimal comments, relying on self-documenting code. Also, check for any necessary imports, but since it's TypeScript, maybe no external libraries are needed here. 

Testing the logic: For example, a skill with high level and experience should return a leadership recommendation. Another with high level but low experience suggests training. Industry skills might need different paths. 

Finally, export the SkillEvaluator class so other modules can use it. Ensure all types are correctly defined and the methods are properly structured.interface SkillData {
  skillType: 'hard' | 'soft' | 'industry';
  skillName: string;
  skillLevel: number;
  yearsOfExperience: number;
  industryAverage: number;
}

export class SkillEvaluator {
  private skills: SkillData[];
  private industryAverages: Record<string, number>;

  constructor(skillData: SkillData[], industryAverages: Record<string, number>) {
    this.skills = skillData;
    this.industryAverages = industryAverages;
  }

  private calculateIndustryComparison(skill: SkillData): number {
    const average = this.industryAverages[skill.skillName] || skill.industryAverage;
    return (skill.skillLevel - average) / average * 100;
  }

  private determineCareerPath(skill: SkillData): string {
    const comparison = this.calculateIndustryComparison(skill);
    
    if (skill.skillLevel >= 4 && skill.yearsOfExperience >= 5) {
      return `${skill.skillName}リーダーシップポジション推奨`;
    }
    if (comparison > 20) {
      return `スペシャリスト育成プログラム提案`;
    }
    if (comparison < -15) {
      return `基礎スキル強化トレーニング推奨`;
    }
    return 'キャリア維持が適切';
  }

  evaluate() {
    return this.skills.map(skill => ({
      ...skill,
      industryComparison: this.calculateIndustryComparison(skill),
      careerPath: this.determineCareerPath(skill),
      developmentRecommendation: this.generateRecommendation(skill)
    }));
  }

  private generateRecommendation(skill: SkillData): string {
    const recommendations = {
      hard: `技術認定取得（${skill.skillName}）`,
      soft: 'コミュニケーション研修',
      industry: `業界別専門講座（${skill.skillName}）`
    };
    
    return skill.skillLevel >= 4 
      ? `${recommendations[skill.skillType]} + メンター制度活用`
      : `${recommendations[skill.skillType]} + 基礎トレーニング`;
  }
}