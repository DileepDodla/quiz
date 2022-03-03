import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category, CategoryQuestionsCount } from '../models/category.model';
import { ApiRequest } from '../models/api-request.model';
import { QuestionData } from '../models/question-data.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  static totalNumOfQuestions: number = 0;
  static categories: Category[] = [];
  static categoryQuestionsCount: CategoryQuestionsCount[] = [];
  static questionsData: QuestionData[];
  /*[
    {
      "category": "RW50ZXJ0YWlubWVudDogVmlkZW8gR2FtZXM=",
      "type": "bXVsdGlwbGU=",
      "difficulty": "ZWFzeQ==",
      "question": "V2hpY2ggcG9wdWxhciBGaXJzdCBQZXJzb24gU2hvb3RlciAoRlBTKSBmcmFuY2hpc2UsIGdvdCBhIFJlYWwgVGltZSBTdHJhdGVneSAoUlRTKSBnYW1lIGRldmVsb3BlZCBiYXNlZCBvbiBpdHMgdW5pdmVyc2U/",
      "correct_answer": "SGFsbw==",
      "incorrect_answers": [
        "QmF0dGxlZmllbGQ=",
        "Q2FsbCBvZiBEdXR5",
        "Qm9yZGVybGFuZHM="
      ]
    },
    {
      "category": "U2NpZW5jZTogQ29tcHV0ZXJz",
      "type": "bXVsdGlwbGU=",
      "difficulty": "ZWFzeQ==",
      "question": "V2hhdCBkb2VzIHRoZSBQcnQgU2MgYnV0dG9uIGRvPw==",
      "correct_answer": "Q2FwdHVyZXMgd2hhdCdzIG9uIHRoZSBzY3JlZW4gYW5kIGNvcGllcyBpdCB0byB5b3VyIGNsaXBib2FyZA==",
      "incorrect_answers": [
        "Tm90aGluZw==",
        "U2F2ZXMgYSAucG5nIGZpbGUgb2Ygd2hhdCdzIG9uIHRoZSBzY3JlZW4gaW4geW91ciBzY3JlZW5zaG90cyBmb2xkZXIgaW4gcGhvdG9z",
        "Q2xvc2VzIGFsbCB3aW5kb3dz"
      ]
    },
    {
      "category": "RW50ZXJ0YWlubWVudDogVmlkZW8gR2FtZXM=",
      "type": "bXVsdGlwbGU=",
      "difficulty": "ZWFzeQ==",
      "question": "V2hhdCBpcyB0aGUgdGl0bGUgb2Ygc29uZyBvbiB0aGUgbWFpbiBtZW51IGluIEhhbG8/",
      "correct_answer": "SGFsbw==",
      "incorrect_answers": [
        "T3BlbmluZyBTdWl0ZQ==",
        "U2hhZG93cw==",
        "U3VpdGUgQXV0dW1u"
      ]
    },
    {
      "category": "R2VuZXJhbCBLbm93bGVkZ2U=",
      "type": "Ym9vbGVhbg==",
      "difficulty": "ZWFzeQ==",
      "question": "SW4gMjAxMCwgVHdpdHRlciBhbmQgdGhlIFVuaXRlZCBTdGF0ZXMgTGlicmFyeSBvZiBDb25ncmVzcyBwYXJ0bmVyZWQgdG9nZXRoZXIgdG8gYXJjaGl2ZSBldmVyeSB0d2VldCBieSBBbWVyaWNhbiBjaXRpemVucy4=",
      "correct_answer": "VHJ1ZQ==",
      "incorrect_answers": [
        "RmFsc2U="
      ]
    },
    {
      "category": "RW50ZXJ0YWlubWVudDogTXVzaWNhbHMgJiBUaGVhdHJlcw==",
      "type": "bXVsdGlwbGU=",
      "difficulty": "bWVkaXVt",
      "question": "V2hhdCB3YXMgR2VvcmdlIEJpemV0J3MgbGFzdCBvcGVyYT8=",
      "correct_answer": "Q2FybWVu",
      "incorrect_answers": [
        "RG9uIFJvZHJpZ3Vl",
        "R3Jpc8OpbGlkaXM=",
        "TGVzIHDDqmNoZXVycyBkZSBwZXJsZXM="
      ]
    },
    {
      "category": "RW50ZXJ0YWlubWVudDogTXVzaWM=",
      "type": "bXVsdGlwbGU=",
      "difficulty": "bWVkaXVt",
      "question": "V2hpY2ggb25lIG9mIHRoZXNlIFBpbmsgRmxveWQgYWxidW1zIHdlcmUgYWxzbyBhIG1vdmllPw==",
      "correct_answer": "VGhlIFdhbGw=",
      "incorrect_answers": [
        "VGhlIERhcmsgU2lkZSBvZiB0aGUgTW9vbg==",
        "V2lzaCBZb3UgV2VyZSBIZXJl",
        "QW5pbWFscw=="
      ]
    },
    {
      "category": "RW50ZXJ0YWlubWVudDogVGVsZXZpc2lvbg==",
      "type": "Ym9vbGVhbg==",
      "difficulty": "ZWFzeQ==",
      "question": "SW4gIkRvY3RvciBXaG8iLCB0aGUgRG9jdG9yIGdldHMgaGlzIFRBUkRJUyBieSBzdGVhbGluZyBpdC4=",
      "correct_answer": "VHJ1ZQ==",
      "incorrect_answers": [
        "RmFsc2U="
      ]
    },
    {
      "category": "TXl0aG9sb2d5",
      "type": "bXVsdGlwbGU=",
      "difficulty": "ZWFzeQ==",
      "question": "V2hhdCBteXRvbG9naWNhbCBjcmVhdHVyZXMgaGF2ZSB3b21lbidzIGZhY2VzIGFuZCB2dWx0dXJlcycgYm9kaWVzPw==",
      "correct_answer": "SGFycGllcw==",
      "incorrect_answers": [
        "TWVybWFpZHM=",
        "TnltcGg=",
        "TGlsaXRo"
      ]
    },
    {
      "category": "U2NpZW5jZSAmIE5hdHVyZQ==",
      "type": "bXVsdGlwbGU=",
      "difficulty": "bWVkaXVt",
      "question": "SW4gaHVtYW4gYmlvbG9neSwgYSBjaXJjYWRpdW0gcmh5dGhtIHJlbGF0ZXMgdG8gYSBwZXJpb2Qgb2Ygcm91Z2hseSBob3cgbWFueSBob3Vycz8=",
      "correct_answer": "MjQ=",
      "incorrect_answers": [
        "OA==",
        "MTY=",
        "MzI="
      ]
    },
    {
      "category": "RW50ZXJ0YWlubWVudDogVmlkZW8gR2FtZXM=",
      "type": "bXVsdGlwbGU=",
      "difficulty": "ZWFzeQ==",
      "question": "V2hhdCBpcyB0aGUgbmFtZSBvZiB0aGUgdGFsa2luZyBjYXQgaW4gUGVyc29uYSA1Pw==",
      "correct_answer": "TW9yZ2FuYQ==",
      "incorrect_answers": [
        "VGVkZGll",
        "TWFyaWU=",
        "Unl1amk="
      ]
    }
  ];*/
  /*
  [
    {
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "easy",
      "question": "The series of the Intel HD graphics generation succeeding that of the 5000 and 6000 series (Broadwell) is called:",
      "correct_answer": "HD Graphics 500",
      "incorrect_answers": [
        "HD Graphics 700 ",
        "HD Graphics 600",
        "HD Graphics 7000"
      ]
    },
    {
      "category": "Science & Nature",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What is the chemical formula for ammonia?",
      "correct_answer": "NH3",
      "incorrect_answers": [
        "CO2",
        "NO3",
        "CH4"
      ]
    },
    {
      "category": "Sports",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Who won the 2015 Formula 1 World Championship?",
      "correct_answer": "Lewis Hamilton",
      "incorrect_answers": [
        "Nico Rosberg",
        "Sebastian Vettel",
        "Jenson Button"
      ]
    },
    {
      "category": "Entertainment: Music",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Kanye West&#039;s &quot;Gold Digger&quot; featured which Oscar-winning actor?",
      "correct_answer": "Jamie Foxx",
      "incorrect_answers": [
        "Alec Baldwin",
        "Dwayne Johnson",
        " Bruce Willis"
      ]
    },
    {
      "category": "History",
      "type": "multiple",
      "difficulty": "hard",
      "question": "Which of the following was not one of Joseph Stalin&#039;s ten blows during World War II?",
      "correct_answer": "Vistula-Oder Offensive",
      "incorrect_answers": [
        "Crimean Offensive",
        "Leningrad-Novgorod Offensive",
        "Operation Bagration"
      ]
    },
    {
      "category": "Entertainment: Cartoon & Animations",
      "type": "multiple",
      "difficulty": "hard",
      "question": "Townsend Coleman provided the voice for which turtle in the original 1987 series of &quot;Teenage Mutant Ninja Turtles&quot;?",
      "correct_answer": "Michelangelo",
      "incorrect_answers": [
        "Leonardo",
        "Donatello",
        "Raphael"
      ]
    },
    {
      "category": "Geography",
      "type": "boolean",
      "difficulty": "easy",
      "question": "There is an island in Japan called Ōkunoshima, A.K.A. &quot;Rabbit Island&quot;, so named because of it&#039;s huge population of rabbits.",
      "correct_answer": "True",
      "incorrect_answers": [
        "False"
      ]
    },
    {
      "category": "Entertainment: Video Games",
      "type": "multiple",
      "difficulty": "easy",
      "question": "Which of the following games has the largest map size?",
      "correct_answer": "Just Cause 2",
      "incorrect_answers": [
        "Grand Theft Auto 5",
        "The Elder Scrolls 4:  Oblivion",
        "The Witcher 3:  Wild Hunt"
      ]
    },
    {
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What does the &#039;S&#039; in the RSA encryption algorithm stand for?",
      "correct_answer": "Shamir",
      "incorrect_answers": [
        "Secure",
        "Schottky",
        "Stable"
      ]
    },
    {
      "category": "Entertainment: Music",
      "type": "multiple",
      "difficulty": "hard",
      "question": "Which member of the Wu-Tang Clan had only one verse in their debut album Enter the Wu-Tang (36 Chambers)?",
      "correct_answer": "Masta Killa",
      "incorrect_answers": [
        "Method Man",
        "Inspectah Deck",
        "GZA"
      ]
    }
  ];*/

  private GET_API_SESSION_TOKEN_URL = "https://opentdb.com/api_token.php?command=request";
  private RESET_API_SESSION_TOKEN_URL = "https://opentdb.com/api_token.php?command=reset";
  private API_GET_CATEGORIES_URL = "https://opentdb.com/api_category.php";
  private API_COUNT_GLOBAL_URL = "https://opentdb.com/api_count_global.php";
  private GET_QUIZ_DATA_URL = "https://opentdb.com/api.php";

  constructor(private http: HttpClient) { }

  getSessionToken(): Observable<any> {
    return this.http.get(this.GET_API_SESSION_TOKEN_URL);
  }

  resetSessionToken(token: string): Observable<any> {
    const params = new HttpParams().set('token', token);
    return this.http.get(this.RESET_API_SESSION_TOKEN_URL, { params: params });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_GET_CATEGORIES_URL).pipe(map((data: any) => data["trivia_categories"]));
  }

  getCategoriesGlobalCount(): Observable<any> {
    return this.http.get(this.API_COUNT_GLOBAL_URL)
  }

  getQuizData(paramss: ApiRequest): Observable<any> {
    let params = new HttpParams();
    for (let [key, value] of Object.entries(paramss)) {
      params = params.set(key, value);
    }
    return this.http.get(this.GET_QUIZ_DATA_URL, { params: params });
  }
}
