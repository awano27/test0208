import os
from typing import Dict, List, Optional
from dataclasses import dataclass
import json
from pathlib import Path
from skill_analysis.skill_evaluator import SkillEvaluator

@dataclass
class PRTemplate:
    industry: str
    tone: str
    focus_points: List[str]
    achievements_format: str

class PRWriter:
    def __init__(self):
        self.skill_evaluator = SkillEvaluator()
        self.templates = self._load_templates()
        
    def _load_templates(self) -> Dict[str, PRTemplate]:
        template_path = Path(__file__).parent / "templates"
        templates = {}
        for file in template_path.glob("*.json"):
            with open(file) as f:
                data = json.load(f)
                templates[data["industry"]] = PRTemplate(**data)
        return templates

    def generate_pr(self, user_data: Dict, industry: str) -> str:
        skills = self.skill_evaluator.analyze_skills(user_data)
        template = self.templates.get(industry)
        
        achievements = self._format_achievements(skills["achievements"])
        vision = self._create_career_vision(skills, industry)
        emotional_elements = self._add_emotional_elements(skills["soft_skills"])
        
        pr_text = f"""
{self._create_introduction(user_data, template)}

{achievements}

{emotional_elements}

{vision}
        """.strip()
        
        return self._polish_text(pr_text)

    def _format_achievements(self, achievements: List[Dict]) -> str:
        formatted = []
        for achievement in achievements:
            if "metric" in achievement and "value" in achievement:
                formatted.append(
                    f"・{achievement['description']}において{achievement['metric']}を"
                    f"{achievement['value']}達成"
                )
        return "\n".join(formatted)

    def _create_career_vision(self, skills: Dict, industry: str) -> str:
        strengths = skills["core_competencies"]
        industry_trends = self._get_industry_trends(industry)
        
        return (
            f"これまでの{', '.join(strengths[:2])}を活かし、"
            f"{industry_trends}の分野で更なる価値創造に貢献していきたいと考えています。"
        )

    def _add_emotional_elements(self, soft_skills: List[str]) -> str:
        top_skills = soft_skills[:3]
        return (
            f"チームでの協働において{top_skills[0]}を大切にし、"
            f"{top_skills[1]}と{top_skills[2]}を意識して業務に取り組んでいます。"
        )

    def _create_introduction(self, user_data: Dict, template: PRTemplate) -> str:
        experience = user_data.get("years_of_experience", 0)
        speciality = user_data.get("speciality", "")
        
        return (
            f"{experience}年にわたり{speciality}の分野で経験を積んでまいりました。"
        )

    def _get_industry_trends(self, industry: str) -> str:
        trends = {
            "IT": "デジタルトランスフォーメーション",
            "製造": "スマートファクトリー",
            "金融": "フィンテックイノベーション"
        }
        return trends.get(industry, "技術革新")

    def _polish_text(self, text: str) -> str:
        return text.replace("  ", " ").strip()

if __name__ == "__main__":
    writer = PRWriter()
    sample_data = {
        "years_of_experience": 5,
        "speciality": "システム開発",
        "achievements": [
            {"description": "大規模プロジェクト", "metric": "工数削減", "value": "30%"}
        ]
    }
    print(writer.generate_pr(sample_data, "IT"))