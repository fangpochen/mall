#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from typing import Dict, List

class CursorRulesReader:
    def __init__(self, file_path: str = '.cursorrules'):
        self.file_path = file_path
        self.rules: Dict[str, List[str]] = {}

    def read_rules(self) -> Dict[str, List[str]]:
        """读取 .cursorrules 文件并解析内容"""
        if not os.path.exists(self.file_path):
            print(f"错误: 文件 {self.file_path} 不存在")
            return {}

        current_section = ""
        self.rules = {}

        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue

                    if line.startswith('## '):
                        # 新的章节
                        current_section = line[3:].strip()
                        self.rules[current_section] = []
                    elif line.startswith('- '):
                        # 规则项
                        if current_section:
                            self.rules[current_section].append(line[2:].strip())
                    elif line.startswith('```'):
                        # 代码块，保持原格式
                        if current_section:
                            self.rules[current_section].append(line)
                    else:
                        # 其他内容（如代码块内的内容）
                        if current_section:
                            self.rules[current_section].append(line)

        except Exception as e:
            print(f"读取文件时发生错误: {str(e)}")
            return {}

        return self.rules

    def display_rules(self):
        """显示解析后的规则内容"""
        if not self.rules:
            print("没有找到任何规则")
            return

        print("\n=== 商城项目毕设规范 ===\n")
        for section, rules in self.rules.items():
            print(f"\n{section}:")
            for rule in rules:
                if rule.startswith('```'):
                    print(rule)
                else:
                    print(f"  - {rule}")

def main():
    reader = CursorRulesReader()
    reader.read_rules()
    reader.display_rules()

if __name__ == "__main__":
    main() 