import {Injectable} from '@angular/core';
import {MetadataPreview} from "../model/common/MetadataPreview";
import {combineLatest, Observable, zip} from "rxjs";
import {AngularFirestore, CollectionReference} from "@angular/fire/compat/firestore";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  public limit = 10;
  public expandBy = 10;
  public searchString = '';
  public isLoading = false;
  public isInSearch = false;
  public exploreItems: MetadataPreview[] = [];
  $exploreItems?: Observable<MetadataPreview[]>;

  constructor(
    public store: AngularFirestore,
  ) {
    this.setSubscription();
    this.searchInMetadataPreview();
  }

  expand() {
    this.isLoading = true;
    this.limit = this.limit + this.expandBy;
    if (this.isInSearch) {
      this.searchInMetadataPreview();
    }  else {
      this.setSubscription();
    }
  }

  public valueChange = (searchString: string): void => {
    this.searchString = searchString;
  }

  public refresh = (): void => {
    const uids = this.exploreItems.map(prev => prev.uid);
    if (!uids.length) return;
    zip(...uids.map(uid => {
      return this.store.collection<MetadataPreview>('metadata_preview').doc(uid).get()
    })).subscribe(response => {
      response.forEach(resp => {
        const data = resp.data() as any;
        const index = uids.indexOf(data.uid);
        this.exploreItems[index] = data;
      })
    });
  }

  public clearSearch = (): void => {
    this.isInSearch = false;
    this.limit = 10;
    this.exploreItems = [];
    this.searchString = '';
    this.setSubscription();
  }

  public search = (): void => {
    this.isInSearch = true;
    this.exploreItems = [];
    this.limit = 10;
    this.searchInMetadataPreview();
  }

  private searchInMetadataPreview = (): void => {
    if (this.searchString) {
      const searchStringLower = this.searchString.toLowerCase();
      const searchStringNgrams = this.generateNgrams(searchStringLower, 3);

      const searchInTitle = this.store.collection('metadata_preview', ref =>
        ref.where('titleNgrams', 'array-contains-any', searchStringNgrams)
          .limit(this.limit)
      ).valueChanges();

      const searchInSummary = this.store.collection('metadata_preview', ref =>
        ref.where('summaryNgrams', 'array-contains-any', searchStringNgrams)
          .limit(this.limit)
      ).valueChanges();

      const searchInTags = this.store.collection('metadata_preview', ref =>
        ref.where('allTagsNgrams', 'array-contains-any', searchStringNgrams)
          .limit(this.limit)
      ).valueChanges();

      combineLatest([searchInTitle, searchInSummary, searchInTags]).pipe(
        map(([titleResults, summaryResults, tagResults]) => {
          const resultSet = new Map<string, any>();

          const processResult = (result: any) => {
            const id = result.uid;
            resultSet.set(id, result);
          };

          titleResults.forEach(processResult);
          summaryResults.forEach(processResult);
          tagResults.forEach(processResult);

          return Array.from(resultSet.values()).slice(0, this.limit);
        })
      ).subscribe(previews => {
        const offset = this.exploreItems.length;
        for (let i = offset; i < this.limit; i++) {
          if (previews[i])
            this.exploreItems.push(previews[i]);
        }
        this.isLoading = false;
      });

    }
  }

  private generateNgrams = (text: string, n: number): string[] => {
    const ngrams = [];
    for (let i = 0; i < text.length - n + 1; i++) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  }


  public setRef = (ref: CollectionReference): CollectionReference => {
    ref.where('status', '==', 'PUBLISHED')
    ref.limit(this.limit);
    return ref;
  }

  public setSubscription = (): void => {
    this.isLoading = true;
    this.store
      .collection<MetadataPreview>('metadata_preview', this.setRef).valueChanges()
      .subscribe(previews => {
        const offset = this.exploreItems.length;
        for (let i = offset; i < this.limit; i++) {
          if (previews[i])
            this.exploreItems.push(previews[i]);
        }
        this.isLoading = false;
      });
  }
}
