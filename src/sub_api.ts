import axios, { AxiosInstance } from "axios";
import { API_ENDPOINT } from './api';

export class SubAPI {
  db_key: string;
  doc_key: string;
  sub_key: string;
  host: string = API_ENDPOINT;
  _axios: AxiosInstance;  


  constructor(db_key, doc_key, sub_key) {
    this.db_key = db_key
    this.doc_key = doc_key
    this.sub_key = sub_key

    this._axios = axios.create({
      baseURL: this.host,
    })
  }

  async _base_request(method: ("GET" | "POST" | "PATCH" | "PUT" | "DELETE"), url: string, data: object = null) {
    let res = await this._axios({ url: "/db"+url, method, data })
    return res.data
  }

  insert(value) { return this._base_request("PATCH", `/${this.db_key}/${this.doc_key}/insert`, {key: this.sub_key, value}) }

  edit(index, value) { return this._base_request("PATCH", `/${this.db_key}/${this.doc_key}/edit`, {key: this.sub_key, index, value}) }

  remove(index) { return this._base_request("PATCH", `/${this.db_key}/${this.doc_key}/remove`, {key: this.sub_key, index}) }

  move(from, to) { return this._base_request("PATCH", `/${this.db_key}/${this.doc_key}/move`, {key: this.sub_key, from, to}) }
}